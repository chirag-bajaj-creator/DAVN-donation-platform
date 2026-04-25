const streams = new Map();

function streamKey(needyType, caseId) {
  return `${needyType}:${caseId}`;
}

function addTrackingClient(needyType, caseId, res) {
  const key = streamKey(needyType, caseId);
  const clients = streams.get(key) || new Set();
  clients.add(res);
  streams.set(key, clients);

  res.on('close', () => {
    clients.delete(res);
    if (clients.size === 0) {
      streams.delete(key);
    }
  });
}

function writeEvent(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function emitTrackingUpdate(needyType, caseId, payload) {
  const clients = streams.get(streamKey(needyType, caseId));
  if (!clients) return;

  clients.forEach((res) => {
    writeEvent(res, 'tracking:update', payload);
  });
}

function sendTrackingSnapshot(res, payload) {
  writeEvent(res, 'tracking:snapshot', payload);
}

module.exports = {
  addTrackingClient,
  emitTrackingUpdate,
  sendTrackingSnapshot
};
