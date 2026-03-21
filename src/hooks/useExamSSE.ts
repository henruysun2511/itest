import { useAuthStore } from '@/stores/useAuthStore';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useEffect, useRef, useState } from 'react';

// Định nghĩa kiểu sự kiện
export type ExamSessionEventType =
  | 'STUDENT_JOINED'
  | 'STUDENT_SUBMITTED'
  | 'STUDENT_VIOLATION'
  | 'SESSION_STATUS_CHANGED'
  | 'TIME_WARNING'
  | 'RETAKE_GRANTED'
  | 'ATTEMPT_PAUSED'
  | 'ATTEMPT_RESUMED'
  | 'ATTEMPT_DISCONNECTED';

export interface ExamSessionEvent {
  examSessionId: string;
  type: ExamSessionEventType;
  data: any;
  timestamp: string;
}

export const useExamSSE = (examSessionId?: string) => {
  const [latestEvent, setLatestEvent] = useState<ExamSessionEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!examSessionId || !accessToken) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    const url = `${baseUrl}/exam-sessions/${examSessionId}/events`;

    const connect = async () => {
      try {
        setError(null);

        await fetchEventSource(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'text/event-stream',
          },
          signal: abortControllerRef.current?.signal,
          async onopen(response) {
            if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
              setIsConnected(true);
              console.log('[SSE] Connected to exam session:', examSessionId);
            } else {
              throw new Error(`SSE Connection failed: ${response.status}`);
            }
          },
          onmessage(msg) {
            if (msg.data) {
              try {
                const eventPayload: ExamSessionEvent = JSON.parse(msg.data);
                console.log('[SSE] Received Event:', eventPayload.type, eventPayload.data);
                setLatestEvent(eventPayload);
              } catch (e) {
                console.error('[SSE] Failed to parse message data:', e);
              }
            }
          },
          onclose() {
            setIsConnected(false);
            console.log('[SSE] Connection closed by server.');
          },
          onerror(err) {
            setIsConnected(false);
            setError(err instanceof Error ? err : new Error('SSE Error'));
            console.error('[SSE] Error:', err);
            // Optionally throw the error to let it retry, or return to stop
            // return; // return will stop retrying
          }
        });
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err : new Error('SSE Error'));
      }
    };

    connect();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsConnected(false);
    };
  }, [examSessionId, accessToken]);

  return { latestEvent, isConnected, error };
};
