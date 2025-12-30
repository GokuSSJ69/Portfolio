document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (!isLoggedIn() || !currentUser || currentUser.role !== 'admin') {
        alert('You do not have permission to view this page. Please login as an admin.');
        window.location.href = 'login.html';
        return;
    }

    const bookingTableBody = document.getElementById('bookingTableBody');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const searchInput = document.getElementById('adminSearch');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const exportBtn = document.getElementById('exportCsv');
    const refreshBtn = document.getElementById('refreshAdmin');

    function loadBookings() {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    }

    function saveBookings(items) {
        localStorage.setItem('bookings', JSON.stringify(items));
    }

    function renderTable(items) {
        bookingTableBody.innerHTML = '';
        if (!items.length) {
            const noRow = document.createElement('tr');
            noRow.innerHTML = `<td colspan="12" style="text-align: center;">No bookings found.</td>`;
            bookingTableBody.appendChild(noRow);
            return;
        }
        items.forEach(b => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${b.id}</td>
                <td>${b.name}</td>
                <td>${b.email}</td>
                <td>${b.phone}</td>
                <td>${b.destination}</td>
                <td>${b.location}</td>
                <td>${b.travelers}</td>
                <td>${b.checkIn}</td>
                <td>${b.checkOut}</td>
                <td>$${(b.total || 0).toFixed(2)}</td>
                <td>
                    <select class="status-select" data-id="${b.id}">
                        <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>confirmed</option>
                        <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>pending</option>
                        <option value="canceled" ${b.status === 'canceled' ? 'selected' : ''}>canceled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" data-action="delete" data-id="${b.id}" style="height:32px">Delete</button>
                </td>
            `;
            bookingTableBody.appendChild(row);
        });
    }

    function loadMessages() {
        return JSON.parse(localStorage.getItem('messages') || '[]');
    }

    function saveMessages(items) {
        localStorage.setItem('messages', JSON.stringify(items));
    }

    function renderMessages(items) {
        messagesTableBody.innerHTML = '';
        if (!items.length) {
            const noRow = document.createElement('tr');
            noRow.innerHTML = `<td colspan="7" style="text-align: center;">No messages found.</td>`;
            messagesTableBody.appendChild(noRow);
            return;
        }
        items.forEach(m => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.subject}</td>
                <td>${m.message}</td>
                <td>${new Date(m.createdAt).toLocaleString()}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" data-msg="delete" data-id="${m.id}" style="height:32px">Delete</button>
                </td>
            `;
            messagesTableBody.appendChild(row);
        });
    }

    function getView() {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const status = statusFilter?.value || 'all';
        const sort = sortBy?.value || 'createdAt_desc';
        let items = loadBookings();
        if (query) {
            items = items.filter(b =>
                (b.name || '').toLowerCase().includes(query) ||
                (b.email || '').toLowerCase().includes(query) ||
                (b.destination || '').toLowerCase().includes(query)
            );
        }
        if (status !== 'all') {
            items = items.filter(b => (b.status || '').toLowerCase() === status);
        }
        const byDate = (a, b) => new Date(a.createdAt || a.checkIn || 0) - new Date(b.createdAt || b.checkIn || 0);
        const byTotal = (a, b) => (a.total || 0) - (b.total || 0);
        if (sort === 'createdAt_desc') items.sort((a, b) => byDate(b, a));
        if (sort === 'createdAt_asc') items.sort(byDate);
        if (sort === 'total_desc') items.sort((a, b) => byTotal(b, a));
        if (sort === 'total_asc') items.sort(byTotal);
        return items;
    }

    function refresh() {
        renderTable(getView());
        renderMessages(loadMessages());
    }

    bookingTableBody.addEventListener('change', function(e) {
        const target = e.target;
        if (target.classList.contains('status-select')) {
            const id = target.getAttribute('data-id');
            const items = loadBookings();
            const idx = items.findIndex(b => b.id === id);
            if (idx >= 0) {
                items[idx].status = target.value;
                saveBookings(items);
                refresh();
            }
        }
    });

    bookingTableBody.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.getAttribute('data-action') === 'delete') {
            const id = btn.getAttribute('data-id');
            const items = loadBookings().filter(b => b.id !== id);
            saveBookings(items);
            refresh();
        }
    });

    searchInput?.addEventListener('input', refresh);
    statusFilter?.addEventListener('change', refresh);
    sortBy?.addEventListener('change', refresh);
    refreshBtn?.addEventListener('click', refresh);

    exportBtn?.addEventListener('click', function() {
        const items = getView();
        const headers = ['id','name','email','phone','destination','location','travelers','checkIn','checkOut','nights','pricePerPerson','total','status','createdAt'];
        const rows = [headers.join(',')].concat(items.map(b => headers.map(h => {
            const val = b[h] != null ? String(b[h]) : '';
            const escaped = '"' + val.replace(/"/g, '""') + '"';
            return escaped;
        }).join(',')));
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    messagesTableBody.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.getAttribute('data-msg') === 'delete') {
            const id = btn.getAttribute('data-id');
            const items = loadMessages().filter(m => m.id !== id);
            saveMessages(items);
            renderMessages(items);
        }
    });

    refresh();
});
