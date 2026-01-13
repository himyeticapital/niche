import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Add type for photo state
type PhotoState = {
  file: File | null;
  previewUrl: string | null;
};

interface EditProfileDialogProps {
  open?: boolean;
  toggleOpen: () => void;
  initialValues?: {
    name?: string;
    username?: string;
    bio?: string;
    phone?: string;
  };
  onSave: (values: FormData) => void;
}

const FILE_SIZE_LIMIT = 1024 * 1024; // 1 MB

export function EditProfileDialog({
  open = false,
  toggleOpen,
  initialValues,
  onSave,
}: EditProfileDialogProps) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    username: initialValues?.username || "",
    bio: initialValues?.bio || "",
    phone: initialValues?.phone || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Photo upload state
  const [photo, setPhoto] = useState<PhotoState>({
    file: null,
    previewUrl: null,
  });
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Create FormData object
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("bio", form.bio);
    formData.append("phone", form.phone);
    if (photo.file) {
      formData.append("photo", photo.file);
    }
    console.log("🚀 ~ handleSubmit ~ form:", form);
    console.log("🚀 ~ handleSubmit ~ formData:", formData.get("phone"));

    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below.
          </DialogDescription>
          {/* Photo Upload */}
          <div>
            <Label htmlFor="photo">Profile Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  if (file.size > FILE_SIZE_LIMIT) {
                    setPhotoError("File size must be less than 1 MB.");
                    setPhoto({ file: null, previewUrl: null });
                  } else {
                    const previewUrl = URL.createObjectURL(file);
                    setPhoto({ file, previewUrl });
                    setPhotoError(null);
                  }
                } else {
                  setPhoto({ file: null, previewUrl: null });
                  setPhotoError(null);
                }
              }}
            />
            {photoError && (
              <span className="text-red-600 text-xs">{photoError}</span>
            )}
            {photo.previewUrl && !photoError && (
              <img
                src={photo.previewUrl}
                alt="Preview"
                className="mt-2 rounded w-24 h-24 object-cover border"
              />
            )}
          </div>
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="text-red-600 text-xs">{errors.name}</span>
            )}
          </div>
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="text-red-600 text-xs">{errors.username}</span>
            )}
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="text-red-600 text-xs">{errors.phone}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
