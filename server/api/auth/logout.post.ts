export default defineEventHandler(async (event) => {
    // Clear the session cookie
    deleteCookie(event, 'admin-session', {
        path: '/'
    });

    return { message: 'Logged out successfully' };
});
