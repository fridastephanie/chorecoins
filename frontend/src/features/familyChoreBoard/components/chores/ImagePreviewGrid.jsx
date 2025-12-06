export const ImagePreviewGrid = ({ urls }) => {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="preview-images">
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`Preview ${i + 1}`} />
      ))}
    </div>
  );
};
