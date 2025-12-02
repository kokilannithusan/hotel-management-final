import React, { useState, useEffect } from "react";
import { generateId } from "../../utils/formatters";
import type { EmailConfigRecord, EmailConfigForm } from "./types";
import { emptyEmailConfigForm, sectionColors } from "./constants";
import { EmailConfigTab } from "./components";
import { EmailConfigModal } from "./modals";
import {
    getEmailConfigs,
    createEmailConfig,
    updateEmailConfig,
    deleteEmailConfig,
} from "../../services/settingsServices";

export const EmailConfigSettings: React.FC = () => {
    const [emailConfigs, setEmailConfigs] = useState<EmailConfigRecord[]>([]);
    const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
    const [emailConfigForm, setEmailConfigForm] = useState<EmailConfigForm>(
        emptyEmailConfigForm
    );
    const [editingEmailConfig, setEditingEmailConfig] =
        useState<EmailConfigRecord | null>(null);

    const colors = sectionColors.emailConfig;

    useEffect(() => {
        loadEmailConfigs();
    }, []);

    const loadEmailConfigs = async () => {
        const data = await getEmailConfigs();
        setEmailConfigs(data);
    };

    // Email Config CRUD Handlers
    const handleCreateEmailConfig = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload: EmailConfigRecord = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...emailConfigForm,
        };
        await createEmailConfig(payload);
        await loadEmailConfigs();
        setEmailConfigForm(emptyEmailConfigForm);
        setShowEmailConfigModal(false);
    };

    const handleOpenEditEmailConfig = (config: EmailConfigRecord) => {
        setEditingEmailConfig(config);
        setEmailConfigForm({
            hostname: config.hostname,
            password: config.password,
            port: config.port,
            protocol: config.protocol,
            sentEmail: config.sentEmail,
            displayName: config.displayName,
            ccEmail: config.ccEmail,
        });
        setShowEmailConfigModal(true);
    };

    const handleUpdateEmailConfig = async () => {
        if (!editingEmailConfig) return;
        const updatedConfig = { ...editingEmailConfig, ...emailConfigForm };
        await updateEmailConfig(updatedConfig);
        await loadEmailConfigs();
        setEditingEmailConfig(null);
        setEmailConfigForm(emptyEmailConfigForm);
        setShowEmailConfigModal(false);
    };

    const handleDeleteEmailConfig = async (configId: string) => {
        if (
            window.confirm("Are you sure you want to delete this email configuration?")
        ) {
            await deleteEmailConfig(configId);
            await loadEmailConfigs();
        }
    };

    const closeEmailConfigModal = () => {
        setShowEmailConfigModal(false);
        setEditingEmailConfig(null);
        setEmailConfigForm(emptyEmailConfigForm);
    };

    return (
        <>
            <div className={`flex h-screen flex-col overflow-hidden ${colors.background}`}>
                <header
                    className={`shrink-0 rounded-xl border border-white/30 bg-gradient-to-r ${colors.header} p-4 text-white shadow-md`}
                >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        Settings
                    </p>
                    <h1 className="mt-2 text-xl font-bold">Email Configuration</h1>
                    <p className="mt-1 max-w-2xl text-xs text-white/80">
                        Manage email server settings
                    </p>
                </header>

                <main className="flex-1 overflow-hidden px-1 pb-6">
                    <div className="h-full overflow-y-auto space-y-6 pr-1">
                        <EmailConfigTab
                            emailConfigs={emailConfigs}
                            onOpenCreateModal={() => {
                                setEditingEmailConfig(null);
                                setEmailConfigForm(emptyEmailConfigForm);
                                setShowEmailConfigModal(true);
                            }}
                            onOpenEdit={handleOpenEditEmailConfig}
                            onDelete={handleDeleteEmailConfig}
                        />
                    </div>
                </main>
            </div>

            {/* Modals */}
            <EmailConfigModal
                isOpen={showEmailConfigModal}
                onClose={closeEmailConfigModal}
                title={
                    editingEmailConfig
                        ? "Edit Email Configuration"
                        : "Add Email Configuration"
                }
                form={emailConfigForm}
                setForm={setEmailConfigForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    editingEmailConfig
                        ? handleUpdateEmailConfig()
                        : handleCreateEmailConfig(e);
                }}
                submitLabel={editingEmailConfig ? "Update" : "Create"}
            />
        </>
    );
};
