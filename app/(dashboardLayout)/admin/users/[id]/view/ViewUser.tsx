"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types/user.type";
import { formatDate } from "@/utlits/formatDate";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, Shield } from "lucide-react";
import { useRouter } from "next/navigation";


interface ViewUserProps {
  user: IUser;
}

export function ViewUser({ user }: ViewUserProps) {
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-600",
      USER: "bg-blue-600",
      MODERATOR: "bg-orange-600",
    };
    return colors[role] || "bg-gray-600";
  };

  const getStatusBadge = (isActive: boolean, isBlock: boolean) => {
    if (isBlock) return { variant: "destructive" as const, text: "Blocked" };
    if (isActive) return { variant: "default" as const, text: "Active" };
    return { variant: "secondary" as const, text: "Inactive" };
  };

  const statusBadge = getStatusBadge(user.isActive, user.isBlock);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">User Profile</h1>
      </div>

      <Card className="shadow-none">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.avatar || undefined}
                alt={user.name}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {user.name}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className={getRoleColor(user.role)}>
                  <Shield className="mr-1 h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge variant={statusBadge.variant}>
                  {statusBadge.text}
                </Badge>
                {user.isVerify && (
                  <Badge variant="default" className="bg-green-600">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Logins</p>
                <p className="text-lg font-semibold text-foreground">
                  {user.totalLogin}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm text-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="text-sm text-foreground">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-sm text-foreground">
                  {user.address || "Not provided"}
                </p>
              </div>
            </div>
            {user.emergencyContact && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Emergency Contact
                    </p>
                    <p className="text-sm text-foreground">
                      {user.emergencyContact}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-sm text-foreground">
                  {user.birthDate
                    ? formatDate(user.birthDate)
                    : "Not provided"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="text-sm text-foreground">
                  {user.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : "Not provided"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Last Login
                </p>
                <p className="text-sm text-foreground">
                  {user.lastLogin ? formatDate(user.lastLogin) : "Never logged in"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.bio && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">
              {user.bio}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Email Verified
            </span>
            <Badge variant={user.isEmailVerify ? "default" : "secondary"}>
              {user.isEmailVerify ? "Yes" : "No"}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Phone Verified
            </span>
            <Badge variant={user.isPhoneVerify ? "default" : "secondary"}>
              {user.isPhoneVerify ? "Yes" : "No"}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Account Status
            </span>
            <Badge variant={statusBadge.variant}>
              {statusBadge.text}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Account Blocked
            </span>
            <Badge variant={user.isBlock ? "destructive" : "secondary"}>
              {user.isBlock ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}