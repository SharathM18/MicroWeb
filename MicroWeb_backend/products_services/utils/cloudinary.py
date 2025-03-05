import cloudinary
import cloudinary.uploader

from config.config import Config

# Configuration
cloudinary.config(
    cloud_name=Config.CLOUDINARY_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_image(image, folder_name, transformations=None):
    try:
        result = cloudinary.uploader.upload(
            image, folder=folder_name, transformation=transformations
        )
        return {
            "status": "success",
            "message": "Image uploaded successfully",
            "data": {"url": result["secure_url"]},
        }
    except Exception as e:
        return {
            "status": "fail",
            "message": "Failed to upload image...",
            "error": str(e),
        }


def extract_public_id(image_url):
    parts = image_url.split("/")
    upload_index = parts.index("upload")
    public_id_with_extension = "/".join(parts[upload_index + 2 :])
    public_id = public_id_with_extension.split(".")[0]
    return public_id


def delete_image(public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        return {
            "status": "fail",
            "message": "Failed to delete image",
            "error": str(e),
        }
