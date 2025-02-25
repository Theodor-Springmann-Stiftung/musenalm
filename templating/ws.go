package templating

import (
	"log"
	"sync"

	"golang.org/x/net/websocket"
)

// WsServer manages all active WebSocket connections so we can broadcast.
type WsServer struct {
	mu    sync.Mutex
	conns map[*websocket.Conn]bool
}

// NewWsServer creates a WsServer.
func NewWsServer() *WsServer {
	return &WsServer{
		conns: make(map[*websocket.Conn]bool),
	}
}

// Handler is invoked for each new WebSocket connection.
func (s *WsServer) Handler(conn *websocket.Conn) {
	s.mu.Lock()
	s.conns[conn] = true
	s.mu.Unlock()
	log.Println("[WsServer] Connected:", conn.RemoteAddr())

	// Read in a loop until an error (client disconnect).
	var msg string
	for {
		if err := websocket.Message.Receive(conn, &msg); err != nil {
			log.Println("[WsServer] Disconnected:", conn.RemoteAddr())
			s.mu.Lock()
			delete(s.conns, conn)
			s.mu.Unlock()
			conn.Close()
			return
		}
	}
}

// BroadcastReload sends a "reload" message to all connected clients.
func (s *WsServer) BroadcastReload() {
	s.mu.Lock()
	defer s.mu.Unlock()

	for conn := range s.conns {
		err := websocket.Message.Send(conn, "reload")
		if err != nil {
			log.Println("[WsServer] Broadcast error:", err)
			conn.Close()
			delete(s.conns, conn)
		}
	}
}
