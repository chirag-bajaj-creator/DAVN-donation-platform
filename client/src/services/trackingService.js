import apiClient, { API_BASE } from './api';

const trackingService = {
  getMyTrackingCases: async () => {
    console.info('[Track Aid] Loading tracking cases: GET /tracking/mine');
    const response = await apiClient.get('/tracking/mine');
    console.info('[Track Aid] Tracking cases loaded', {
      count: response.data.data?.length || 0,
      cases: response.data.data || []
    });
    return response.data.data || [];
  },

  getCaseTracking: async (needyType, caseId) => {
    console.info('[Track Aid] Loading route details', {
      needyType,
      caseId,
      path: `/tracking/${needyType}/${caseId}`
    });
    const response = await apiClient.get(`/tracking/${needyType}/${caseId}`);
    console.info('[Track Aid] Route details loaded', response.data.data);
    return response.data.data;
  },

  openTrackingStream: (needyType, caseId, handlers = {}) => {
    const token = localStorage.getItem('authToken');
    const url = `${API_BASE}/tracking/${needyType}/${caseId}/stream?token=${encodeURIComponent(token || '')}`;
    console.info('[Track Aid] Opening live tracking stream', {
      needyType,
      caseId,
      hasToken: Boolean(token),
      url: `${API_BASE}/tracking/${needyType}/${caseId}/stream`
    });
    const source = new EventSource(url);

    const handleMessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.info('[Track Aid] Live tracking event received', {
          event: event.type,
          status: payload?.tracking?.status,
          hasCaseLocation: Boolean(payload?.case?.location),
          hasVolunteerLocation: Boolean(payload?.tracking?.volunteerLocation),
          lastLocationAt: payload?.tracking?.lastLocationAt
        });
        handlers.onUpdate?.(payload);
      } catch (error) {
        console.error('[Track Aid] Failed to parse live tracking event', error, event.data);
        handlers.onError?.(error);
      }
    };

    source.addEventListener('tracking:snapshot', handleMessage);
    source.addEventListener('tracking:update', handleMessage);
    source.onerror = (error) => {
      console.error('[Track Aid] Live tracking stream error', {
        readyState: source.readyState,
        needyType,
        caseId,
        error
      });
      handlers.onError?.(error);
    };

    return source;
  },
};

export default trackingService;
