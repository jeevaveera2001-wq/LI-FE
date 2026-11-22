// Cloud Database & API Synchronization Service for LiveTournaments
// Ensures 100% reliable cross-device and multi-user synchronization with MongoDB Atlas backend

export async function fetchCloudBroadcastRequests() {
  try {
    const res = await fetch('/api/broadcast-requests');
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.requests) ? data.requests : [];
  } catch (err) {
    console.warn('[CloudSync] fetchCloudBroadcastRequests failed:', err);
    return [];
  }
}

export async function submitCloudBroadcastRequest(reqData) {
  try {
    const res = await fetch('/api/broadcast-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.request : null;
  } catch (err) {
    console.warn('[CloudSync] submitCloudBroadcastRequest failed:', err);
    return null;
  }
}

export async function declineCloudBroadcastRequest(id) {
  try {
    const res = await fetch('/api/broadcast-requests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] declineCloudBroadcastRequest failed:', err);
    return false;
  }
}

export async function assignCloudBroadcastToSlot(id, slotNumber, streamData) {
  try {
    // 1. Mark request as approved and slotted
    await fetch('/api/broadcast-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'APPROVED', slotNumber })
    });

    // 2. Save stream to the 4-slot Homepage carding system in MongoDB
    if (streamData) {
      await fetch('/api/card-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotNumber, slotData: streamData })
      });
    }
    return true;
  } catch (err) {
    console.warn('[CloudSync] assignCloudBroadcastToSlot failed:', err);
    return false;
  }
}

export async function fetchCloudCardSlots() {
  try {
    const res = await fetch('/api/card-slots');
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && Array.isArray(data.slots) ? data.slots : null;
  } catch (err) {
    console.warn('[CloudSync] fetchCloudCardSlots failed:', err);
    return null;
  }
}

export async function saveCloudCardSlot(slotNumber, slotData) {
  try {
    const res = await fetch('/api/card-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotNumber, slotData })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] saveCloudCardSlot failed:', err);
    return false;
  }
}

export async function submitCloudHostingRequest(hostingData) {
  try {
    const res = await fetch('/api/hosting-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hostingData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.request : null;
  } catch (err) {
    console.warn('[CloudSync] submitCloudHostingRequest failed:', err);
    return null;
  }
}

export async function fetchCloudHostingRequests(type) {
  try {
    const url = type ? `/api/hosting-requests?type=${encodeURIComponent(type)}` : '/api/hosting-requests';
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.requests) ? data.requests : [];
  } catch (err) {
    console.warn('[CloudSync] fetchCloudHostingRequests failed:', err);
    return [];
  }
}

export async function declineCloudHostingRequest(id) {
  try {
    const res = await fetch('/api/hosting-requests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] declineCloudHostingRequest failed:', err);
    return false;
  }
}

// Contact Us Tickets Sync
export async function submitCloudContactTicket(ticketData) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.ticket : null;
  } catch (err) {
    console.warn('[CloudSync] submitCloudContactTicket failed:', err);
    return null;
  }
}

export async function fetchCloudContactTickets() {
  try {
    const res = await fetch('/api/contact');
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.messages) ? data.messages : [];
  } catch (err) {
    console.warn('[CloudSync] fetchCloudContactTickets failed:', err);
    return [];
  }
}

export async function deleteCloudContactTicket(id) {
  try {
    const res = await fetch('/api/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] deleteCloudContactTicket failed:', err);
    return false;
  }
}

export async function updateCloudContactTicket(id, status = 'RESOLVED') {
  try {
    const res = await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] updateCloudContactTicket failed:', err);
    return false;
  }
}

// User Profile Real-Time Sync
export async function fetchUserProfile(email, id) {
  try {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (id) params.append('id', id);
    const res = await fetch(`/api/auth/profile?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && data.user ? data.user : null;
  } catch (err) {
    console.warn('[CloudSync] fetchUserProfile failed:', err);
    return null;
  }
}

export async function dismissVipModal(email, id) {
  try {
    await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, id, action: 'DISMISS_VIP_MODAL' })
    });
  } catch (err) {}
}

// User VIP & Clearance Sync
export async function updateCloudUserVip(userId, email, vipClearances) {
  try {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, vipClearances })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] updateCloudUserVip failed:', err);
    return false;
  }
}

// Platform Settings & Pricing Sync
export async function fetchCloudPlatformSettings() {
  try {
    const res = await fetch('/api/platform-settings');
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.settings : null;
  } catch (err) {
    console.warn('[CloudSync] fetchCloudPlatformSettings failed:', err);
    return null;
  }
}

export async function saveCloudPlatformSettings(settings) {
  try {
    const res = await fetch('/api/platform-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] saveCloudPlatformSettings failed:', err);
    return false;
  }
}

// Live Chat & Match Group Messaging Sync
export async function fetchCloudChatMessages(roomId = 'global') {
  try {
    const res = await fetch(`/api/chat?roomId=${encodeURIComponent(roomId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.messages) ? data.messages : [];
  } catch (err) {
    console.warn('[CloudSync] fetchCloudChatMessages failed:', err);
    return [];
  }
}

export async function sendCloudChatMessage(msgData) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.message : null;
  } catch (err) {
    console.warn('[CloudSync] sendCloudChatMessage failed:', err);
    return null;
  }
}

// Suspicious Activity Reports Sync (Admin & Super Admin Exclusive)
export async function submitCloudSuspiciousReport(reportData) {
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.report : null;
  } catch (err) {
    console.warn('[CloudSync] submitCloudSuspiciousReport failed:', err);
    return null;
  }
}

export async function fetchCloudSuspiciousReports() {
  try {
    const res = await fetch('/api/reports');
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.reports) ? data.reports : [];
  } catch (err) {
    console.warn('[CloudSync] fetchCloudSuspiciousReports failed:', err);
    return [];
  }
}

export async function updateCloudReportStatus(id, status, reviewNotes) {
  try {
    const res = await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewNotes })
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] updateCloudReportStatus failed:', err);
    return false;
  }
}

