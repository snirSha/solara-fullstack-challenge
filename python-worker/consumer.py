import aio_pika
import json
import httpx
import asyncio
from image_generator import ImageGenerator

generator = ImageGenerator()

async def consume():
    try:
        connection = await aio_pika.connect_robust(
            "amqp://guest:guest@rabbitmq:5672/",
            heartbeat=30,
            reconnect_interval=5
        )
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=1)
        print("📡 [Worker] Declaring queue...")
        queue = await channel.declare_queue("image_tasks", durable=True)
    except Exception as e:
        print(f"❌ Failed to connect to RabbitMQ: {e}")
        raise e

    print("📡 [Worker] Starting to listen to queue...")
    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            try:
                async with message.process():
                    try:
                        print("📍 Received message, starting parse...")
                        data = json.loads(message.body)
                        prompt = data["prompt"]
                        campaign_id = data["campaignId"]
                        user_id = data["userId"]

                        print(f"🎯 [Worker][{campaign_id}] Generating image for prompt: {prompt}")
                        loop = asyncio.get_event_loop()
                        image_path = await loop.run_in_executor(None, generator.generate, prompt)
                        print(f"✅ [Worker][{campaign_id}] Image saved to {image_path}")

                        print(f"📍 [Worker][{campaign_id}] Preparing to send status update...")
                        async with httpx.AsyncClient() as client:
                            try:
                                response = await client.post(
                                    f"http://nestjs-service:3000/api/campaigns/{campaign_id}/image-ready",
                                    json={
                                        "imagePath": image_path,
                                        "userId": user_id
                                    }
                                )
                                print(f"📤 [Worker][{campaign_id}] Status update sent: {response.status_code}")
                            except Exception as e:
                                print(f"❌ [Worker][{campaign_id}] Failed to update campaign status: {e}")
                                raise

                        print(f"🏁 [Worker][{campaign_id}] Finished processing")

                    except Exception as e:
                        print(f"❌ [Worker][{campaign_id}] Error processing message: {e}")
                        raise
            except Exception as e:
                print(f"❌ [Worker] Fatal error outside message.process(): {e}")