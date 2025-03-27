package API.BookingPlane.Controller;


import API.BookingPlane.Chatbot.ChatMessage;
import API.BookingPlane.Service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage response = chatbotService.sendMessageToCoze(message);
        // Optionally, you can save 'message' here to a repository or log before sending the response
        return ResponseEntity.ok().body(response);
    }
}

