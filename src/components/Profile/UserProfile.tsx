
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/Auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Heart, Clock, Download } from 'lucide-react';

interface UserPreferences {
  preferred_genres: string[];
  preferred_languages: string[];
  default_quality: string;
  auto_play_next: boolean;
  subtitles_enabled: boolean;
  default_subtitle_language: string;
  parental_controls: any;
}

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance',
  'Sci-Fi', 'Thriller', 'Animation', 'Documentary', 'Family', 'Fantasy', 'Mystery'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_genres: [],
    preferred_languages: ['en'],
    default_quality: '1080p',
    auto_play_next: true,
    subtitles_enabled: false,
    default_subtitle_language: 'en',
    parental_controls: {},
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (data) {
      setPreferences({
        preferred_genres: Array.isArray(data.preferred_genres) ? data.preferred_genres : [],
        preferred_languages: Array.isArray(data.preferred_languages) ? data.preferred_languages : ['en'],
        default_quality: data.default_quality || '1080p',
        auto_play_next: data.auto_play_next ?? true,
        subtitles_enabled: data.subtitles_enabled ?? false,
        default_subtitle_language: data.default_subtitle_language || 'en',
        parental_controls: data.parental_controls || {},
      });
    }
  };

  const updateProfile = async (updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user?.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      fetchProfile();
    }
    setLoading(false);
  };

  const updatePreferences = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user?.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Preferences updated successfully',
      });
    }
    setLoading(false);
  };

  const toggleGenre = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_genres: prev.preferred_genres.includes(genre)
        ? prev.preferred_genres.filter(g => g !== genre)
        : [...prev.preferred_genres, genre]
    }));
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
          <User className="mr-3" /> User Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="mr-2" size={20} />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Full Name</Label>
                <Input
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-800 border-gray-700 text-gray-400"
                />
              </div>
              <Button
                onClick={() => updateProfile({ full_name: profile?.full_name })}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Viewing Preferences */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="mr-2" size={20} />
                Viewing Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Default Quality</Label>
                <Select
                  value={preferences.default_quality}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, default_quality: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Auto-play Next Episode</Label>
                <Switch
                  checked={preferences.auto_play_next}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, auto_play_next: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Enable Subtitles</Label>
                <Switch
                  checked={preferences.subtitles_enabled}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, subtitles_enabled: checked }))}
                />
              </div>

              <div>
                <Label className="text-white">Default Subtitle Language</Label>
                <Select
                  value={preferences.default_subtitle_language}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, default_subtitle_language: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={updatePreferences}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Preferred Genres */}
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="mr-2" size={20} />
                Preferred Genres
              </CardTitle>
              <CardDescription className="text-gray-400">
                Select your favorite genres to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={preferences.preferred_genres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      preferences.preferred_genres.includes(genre)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={updatePreferences}
                disabled={loading}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Save Genre Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
