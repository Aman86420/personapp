"use client";

import { CircleUser } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Shell } from '@/app/components/Shell';
import './AccountPage.css';

export default function AccountPage() {
    const { data: session } = useSession();

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <Shell>
            <div className="account-container">
                <div className="account-content">
                    <div className="profile-section">
                        <div className="profile-photo">
                            <CircleUser className="profile-photo-icon" />
                        </div>
                        <h1 className="profile-name">{session?.user?.name || 'User'}</h1>
                        <p className="profile-email">{session?.user?.email || 'email@example.com'}</p>
                    </div>

                    <div className="account-card">
                        <p className="card-placeholder">Account details and settings will appear here.</p>
                    </div>

                    <button onClick={handleSignOut} className="signout-button">
                        Sign Out
                    </button>
                </div>
            </div>
        </Shell>
    );
}
