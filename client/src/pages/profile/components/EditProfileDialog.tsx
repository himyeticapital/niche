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

interface EditProfileDialogProps {
  open?: boolean;
  toggleOpen: () => void;
  initialValues?: {
    name?: string;
    username?: string;
    bio?: string;
    phone?: string;
  };
  onSave: (values: {
    name: string;
    username: string;
    bio: string;
    phone: string;
  }) => void;
}

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
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below.
          </DialogDescription>
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
