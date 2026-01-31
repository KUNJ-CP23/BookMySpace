import { useEffect, useState } from "react";
import API from "../services/api";

export default function FacilityImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    API.get("/FacilityImages")
      .then((res) => setImages(res.data))
      .catch((err) => console.log("FacilityImages Error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Facility Images</h2>
      <p className="text-zinc-400 mt-1">GetAll facility images</p>

      <div className="mt-5 space-y-3">
        {images.length === 0 ? (
          <p>No images found</p>
        ) : (
          images.map((img) => (
            <div
              key={img.facilityImageId || img.imageId || img.id}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <p><b>ImageId:</b> {img.facilityImageId}</p>
              <p><b>FacilityId:</b> {img.facilityId}</p>
              <p><b>Path:</b> {img.imageUrl || img.imagePath}</p>

              {(img.imageUrl || img.imagePath) && (
                <img
                    src={img.imageUrl || img.imagePath}
                    alt="facility"
                    className="mt-3 h-40 w-full rounded-xl object-cover border border-zinc-800"
                />
                )}
              <p><b>CreatedAt:</b> {String(img.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}