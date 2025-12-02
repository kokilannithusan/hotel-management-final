import React, { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { EmailConfigForm } from "../types";
import { Eye, EyeOff } from "lucide-react";

interface EmailConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    form: EmailConfigForm;
    setForm: (form: EmailConfigForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export const EmailConfigModal: React.FC<EmailConfigModalProps> = ({
    isOpen,
    onClose,
    title,
    form,
    setForm,
    onSubmit,
    submitLabel,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [ccEnabled, setCcEnabled] = useState(!!form.ccEmail);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="xl"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>{submitLabel}</Button>
                </>
            }
        >
            <form onSubmit={onSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Display Name"
                            placeholder="Hotel Management System"
                            value={form.displayName}
                            onChange={(e) =>
                                setForm({ ...form, displayName: e.target.value })
                            }
                            required
                        />
                        <Input
                            label="Sent Email"
                            type="email"
                            placeholder="noreply@hotel.com"
                            value={form.sentEmail}
                            onChange={(e) => setForm({ ...form, sentEmail: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Hostname"
                            placeholder="smtp.gmail.com"
                            value={form.hostname}
                            onChange={(e) => setForm({ ...form, hostname: e.target.value })}
                            required
                        />
                        <Input
                            label="Port"
                            type="number"
                            placeholder="587"
                            value={form.port}
                            onChange={(e) => setForm({ ...form, port: e.target.value })}
                            required
                        />
                    </div>

                    <Select
                        label="Protocol"
                        value={form.protocol}
                        onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                        options={[
                            { value: "SMTP", label: "SMTP" },
                            { value: "SMTPS", label: "SMTPS" },
                            { value: "TLS", label: "TLS" },
                        ]}
                        required
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="cc-enabled"
                                checked={ccEnabled}
                                onChange={(e) => {
                                    setCcEnabled(e.target.checked);
                                    if (!e.target.checked) {
                                        setForm({ ...form, ccEmail: "" });
                                    }
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="cc-enabled"
                                className="text-sm font-medium text-slate-700"
                            >
                                Enable CC Email
                            </label>
                        </div>
                        {ccEnabled && (
                            <Input
                                placeholder="admin@hotel.com"
                                type="email"
                                value={form.ccEmail || ""}
                                onChange={(e) => setForm({ ...form, ccEmail: e.target.value })}
                            />
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
};
