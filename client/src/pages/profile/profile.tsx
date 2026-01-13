import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import useUpdatePreferences, {
  UserPreferences,
} from "@/hooks/user/use-update-preferences";
import ProfileCard from "./components/ProfileCard";
import PreferencesCard from "./components/PreferencesCard";
import { useToast } from "@/hooks/use-toast";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { useState } from "react";
import useUpdateUser from "@/hooks/user/use-update-user";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);

  const { mutate: updatePreferences, isPending: isUpdatingPreferences } =
    useUpdatePreferences({
      onSuccess: () => {
        toast({
          title: "Preferences Updated Successfully!",
          variant: "success",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Updating Preferences",
          description: "An error occurred. Please try again later.",
          variant: "error",
        });
      },
    });

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser({
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully!",
        variant: "success",
      });
      setOpenEditUserDialog(false);
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Profile!",
        description: "An error occurred. Please try again later.",
        variant: "error",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" replace />;
  }

  const getInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const updateUserPreferences = (preferences: UserPreferences) => {
    updatePreferences(preferences);
  };
  const updateUserProfile = (data: FormData) => {
    updateUser(data);
  };

  const toggleDialog = () => setOpenEditUserDialog((prev) => !prev);

  const initialUserEditValues = {
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  };

  return (
    <div className="min-h-screen pb-16">
      {openEditUserDialog && (
        <EditProfileDialog
          open
          toggleOpen={toggleDialog}
          initialValues={initialUserEditValues}
          onSave={updateUserProfile}
        />
      )}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <ProfileCard
            user={user}
            getInitials={getInitials}
            onEdit={toggleDialog}
          />
          <PreferencesCard
            initialPreferences={user?.userPreference}
            onSave={updateUserPreferences}
            loading={isUpdatingPreferences}
          />
        </div>
      </div>
    </div>
  );
}
