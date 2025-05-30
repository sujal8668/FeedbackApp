const uploadImage = async (imageFile) => {
  if (!imageFile) return { imageUrl: "" };

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "unsigned_preset"); // 👈 your actual preset name
  formData.append("cloud_name", "dxrzlrtf5");          // 👈 your actual cloud name

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dxrzlrtf5/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return { imageUrl: data.secure_url };
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return { imageUrl: "" };
  }
};
export default uploadImage;