import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, Star, Shield, Edit } from "lucide-react";

function ProfileCard({
  user,
  getInitials,
}: {
  user: any;
  getInitials: () => string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20">
            {user?.avatar && (
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              {user?.isVerified && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {user?.isOrganizer && <Badge variant="outline">Organizer</Badge>}
            </div>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
          <Button variant="outline" size="sm" data-testid="button-edit-profile">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>

        {user?.bio && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          </>
        )}

        {user?.isOrganizer && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4">Organizer Stats</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {user.eventsHosted || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Events Hosted
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {user.rating?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Star className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {user.reviewCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
