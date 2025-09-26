import asyncio
from consumer import consume

async def main():
    print("⏳ Waiting for RabbitMQ to wake up...")
    await asyncio.sleep(15)
    for i in range(10):
        try:
            print(f"🔄 Attempt {i+1} to connect to RabbitMQ...")
            await consume()
            print("✅ Worker is now listening for messages")
            break
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            await asyncio.sleep(3)

if __name__ == "__main__":
    print("🚀 Python worker starting...")
    asyncio.run(main())