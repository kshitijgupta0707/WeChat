import { useState, useEffect } from 'react';
import { Search, Users, UserPlus, X, CheckCircle } from 'lucide-react';

export default function ContactsSection() {
    

    // Sample data - in a real app, this would come from your backend



    const handleSearch = (e) => {
        e.preventDefault();
        // Additional search handling if needed
    };



    return (
        <div className="flex flex-col h-full bg-base-100">
            <div className="border-b border-base-300 w-full p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="size-5 text-primary" />
                        <h2 className="font-medium text-lg">Contacts</h2>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn btn-sm btn-primary flex items-center gap-1 text-white"
                    >
                        <UserPlus className="size-4" />
                        <span className="hidden sm:inline">Invite</span>
                    </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-xs checkbox-primary"
                        />
                        <span className="text-sm">Online only</span>
                    </label>
                    <span className="text-xs text-base-content/60">
                        {onlineUsers.length} online
                    </span>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        className="input input-bordered w-full pl-10 py-2 h-10 text-sm"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 size-4 text-base-content/50" />
                </form>
            </div>

        </div>
    );
}