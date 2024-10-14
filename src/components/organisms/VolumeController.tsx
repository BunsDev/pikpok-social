type Props = {
  volume: number;
  onVolumeChange: (volume: number) => void;
};

const VolumeController = ({ volume, onVolumeChange }: Props) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume); // Call the parent function to update volume in ReactPlayer
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};

export default VolumeController;
