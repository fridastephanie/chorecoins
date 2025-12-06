export const ImagePreviewGrid = ({ urls }) => {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="preview-images" role="group" aria-label="Preview images">
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`Uploaded image preview ${i + 1}`} />
      ))}
    </div>
  );
};