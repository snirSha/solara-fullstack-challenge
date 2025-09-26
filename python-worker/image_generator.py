from diffusers import StableDiffusionPipeline
import torch
import uuid
import os

class ImageGenerator:
    def __init__(self, output_dir="output"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
        self.pipe = self.pipe.to("cuda" if torch.cuda.is_available() else "cpu")

    def generate(self, prompt: str) -> str:
        image = self.pipe(prompt).images[0]
        image_name = f"{uuid.uuid4().hex}.png"
        image_path = os.path.join(self.output_dir, image_name)
        image.save(image_path)
        return image_name