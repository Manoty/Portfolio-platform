import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);

  const [nameForm, setNameForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
  });
  const [pwForm, setPwForm] = useState({
    old_password: "", new_password: "",
  });
  const [nameSaving, setNameSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameMsg("");
    try {
      const updated = await authService.updateMe(nameForm);
      setUser(updated);
      setNameMsg("Name updated successfully.");
    } finally {
      setNameSaving(false);
    }
  };

  const handlePwSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg("");
    setPwError("");
    try {
      await authService.changePassword(pwForm.old_password, pwForm.new_password);
      setPwForm({ old_password: "", new_password: "" });
      setPwMsg("Password changed successfully.");
    } catch {
      setPwError("Incorrect current password or invalid new password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email} · {user?.role}</p>
      </div>

      {/* Name */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Personal Info</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleNameSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={nameForm.first_name}
                onChange={(e) => setNameForm({ ...nameForm, first_name: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={nameForm.last_name}
                onChange={(e) => setNameForm({ ...nameForm, last_name: e.target.value })}
                required
              />
            </div>
            {nameMsg && <p className="text-sm text-green-600">{nameMsg}</p>}
            <Button type="submit" loading={nameSaving}>Save Name</Button>
          </form>
        </CardBody>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Change Password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePwSave} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={pwForm.old_password}
              onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={pwForm.new_password}
              onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
              required
            />
            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            {pwMsg && <p className="text-sm text-green-600">{pwMsg}</p>}
            <Button type="submit" loading={pwSaving}>Change Password</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}