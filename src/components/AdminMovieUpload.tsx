
import { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { uploadMovieContent } from '@/services/movieService';

const AdminMovieUpload = () => {
  const [tmdbId, setTmdbId] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a video file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!tmdbId || !file) {
      toast({
        title: "Missing Information",
        description: "Please provide TMDB ID and select a video file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      const result = await uploadMovieContent(parseInt(tmdbId), file, quality);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: "Movie has been uploaded and is now available for streaming.",
        });
        
        // Reset form
        setTmdbId('');
        setFile(null);
        setUploadProgress(0);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload movie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-600 p-2 rounded-full">
          <Upload className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold">Admin: Upload Movie Content</h3>
          <p className="text-gray-400 text-sm">Upload video files to make movies available for streaming</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="tmdb-id" className="text-white">TMDB Movie ID</Label>
          <Input
            id="tmdb-id"
            type="number"
            value={tmdbId}
            onChange={(e) => setTmdbId(e.target.value)}
            placeholder="e.g., 550 for Fight Club"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="quality" className="text-white">Video Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4K">4K Ultra HD</SelectItem>
              <SelectItem value="1080p">1080p Full HD</SelectItem>
              <SelectItem value="720p">720p HD</SelectItem>
              <SelectItem value="480p">480p SD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="video-file" className="text-white">Video File</Label>
          <Input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="bg-gray-800 border-gray-600 text-white file:bg-red-600 file:text-white file:border-0 file:rounded file:mr-2"
          />
          {file && (
            <p className="text-sm text-gray-400 mt-1">
              Selected: {file.name} ({(file.size / 1024 / 1024 / 1024).toFixed(2)} GB)
            </p>
          )}
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Uploading...</span>
              <span>{uploadProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={uploading || !tmdbId || !file}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Upload Movie
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
        <div className="flex items-start space-x-2">
          <AlertCircle className="text-blue-400 mt-0.5" size={16} />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">How to use:</p>
            <ul className="space-y-1 text-xs">
              <li>• Find the TMDB ID from themoviedb.org URL (e.g., /movie/550/)</li>
              <li>• Upload high-quality video files (MP4 format recommended)</li>
              <li>• Files are stored securely in Supabase Storage</li>
              <li>• Movies become immediately available for streaming</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieUpload;
