from image_generator import ImageGenerator
import time

prompt = "a futuristic city skyline at sunset"
gen = ImageGenerator()

print("🎨 Generating image...")
start = time.time()
image_name = gen.generate(prompt)
print(f"🖼️ Image saved as {image_name} in {time.time() - start:.2f} seconds")