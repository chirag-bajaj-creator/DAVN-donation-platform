let ioInstance = null;

function setSocketServer(io) {
  ioInstance = io;
}

function getSocketServer() {
  return ioInstance;
}

function emitToAdmins(event, payload) {
  if (!ioInstance) {
    return;
  }

  ioInstance.to('role:admin').emit(event, payload);
}

function emitToUser(userId, event, payload) {
  if (!ioInstance || !userId) {
    return;
  }

  ioInstance.to(`user:${userId.toString()}`).emit(event, payload);
}

function emitRealtimeUpdate({ adminEvent, userId, userEvent, payload }) {
  if (adminEvent) {
    emitToAdmins(adminEvent, payload);
  }

  if (userId && userEvent) {
    emitToUser(userId, userEvent, payload);
  }
}

module.exports = {
  setSocketServer,
  getSocketServer,
  emitToAdmins,
  emitToUser,
  emitRealtimeUpdate,
};
