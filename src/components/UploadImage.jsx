import { supabase } from "./services/supabaseClient";
import { useState } from "react";

export default function UploadImage({ session, onAddingImage }) {
  const [imageFile, setImageFile] = useState(null);
  if (!session?.user) return;

  async function handleAddImage() {
    const fileName = `${session.user.id}/${Date.now()}-${imageFile.name}`;
    const { error, data } = await supabase.storage
      .from("demo")
      .upload(fileName, imageFile, {
        upsert: true
      });
    if (error) {
      alert("Upload Failed");
    } else {
      console.log("Image Uploaded Successfully!", data);
      if (onAddingImage) onAddingImage();
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button onClick={handleAddImage}>Add Image</button>
    </div>
  );
}
