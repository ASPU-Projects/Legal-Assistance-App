import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  TextField,
  IconButton,
  Skeleton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/system";
import Pusher from "pusher-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChatContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  height: "80vh",
  backgroundColor: "#f9f9f9",
});

const ChatList = styled(Box)({
  backgroundColor: "#fff",
  borderRight: "1px solid #ddd",
  overflowY: "auto",
});

const ChatArea = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f0f4f8",
});

const MessagesArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "1rem",
});

const MessageInputArea = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "0.5rem",
  borderTop: "1px solid #ddd",
  backgroundColor: "#fff",
});

export default function ConversationsPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCon, setLoadingCon] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const handleSelectLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    navigate(`?id=${lawyer.id}`);
  };
  // fetch all chats areas
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingCon(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}v1/web/conversations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // let fetchChats = {
        //   name: localStorage.getItem("user")
        //     ? res.data.messages?.lawyer_name
        //     : res.data.messages?.user_name,
        //   id: res.data.messages.id,
        // };
        const fetchChats = res.data.conversations.map((msg) => ({
          name:
            localStorage.getItem("role") === "user"
              ? msg?.lawyer_name
              : msg?.user_name,
          avatar:
            localStorage.getItem("role") === "user"
              ? msg?.lawyer_avatar
              : msg?.user_avatar,
          id: msg.id,
        }));
        setLawyers(fetchChats);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingCon(false);
      }
    };

    fetchChats();
  }, []);
  // Fetch messages from API
  useEffect(() => {
    if (!selectedLawyer) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}v1/web/conversations/${selectedLawyer.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        // تحويل الرسائل إلى الشكل المطلوب
        const fetchedMessages = res.data.messages.map((msg) => ({
          // id: msg.id,
          text: msg.content,
          sender: msg?.sender,
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedLawyer]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    if (id) {
      const lawyer = lawyers.find((l) => l.id === parseInt(id));
      if (lawyer) {
        setSelectedLawyer(lawyer);
      }
    }
    // استرجاع الـ token من الـ localStorage
    let accessToken = localStorage.getItem("access_token");

    // إعداد Pusher
    let pusher = new Pusher("7e221c9a276e6d97951f", {
      cluster: "mt1",
      forceTLS: true,
      // إضافة الـ token للتوثيق (إذا كنت بحاجة إليه)
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // التحقق من الاتصال بـ Pusher
    pusher.connection.bind("connected", () => {
      console.log("Connected to Pusher!");
    });

    pusher.connection.bind("error", (err) => {
      console.error("Pusher connection error:", err);
    });

    // الاشتراك في القنوات مباشرة بدون متغيرات
    pusher.subscribe(`conversation_${id}`).bind("message.sent", (data) => {
      console.log("New message received from message.sent channel: ", data);
      const newMessageObj = {
        // id: data.id,
        text: data.message,
        sender: data.sender,
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObj]);
      // alert(`New message: ${data}`); // يمكن إضافة رسالة منبثقة للاختبار
    });

    pusher
      .subscribe("send.notification.from.user.to.lawyer")
      .bind("new_notification", (data) => {
        console.log("New notification from user to lawyer: ", data);
      });

    pusher
      .subscribe("send.notification.from.representative.to.lawyer")
      .bind("new_notification", (data) => {
        console.log("New notification from representative to lawyer: ", data);
      });

    pusher
      .subscribe("send.notification.from.representative.to.user")
      .bind("new_notification", (data) => {
        console.log("New notification from representative to user: ", data);
      });

    pusher
      .subscribe("send.notification.from.lawyer.to.representative")
      .bind("new_notification", (data) => {
        console.log("New notification from lawyer to representative: ", data);
      });

    pusher
      .subscribe("send.notification.from.lawyer.to.user")
      .bind("new_notification", (data) => {
        console.log("New notification from lawyer to user: ", data);
      });

    // تنظيف عند مغادرة المكون
    return () => {
      pusher.unsubscribe("message.sent");
      pusher.unsubscribe(`conversation_${id}`);
      pusher.unsubscribe("send.notification.from.user.to.lawyer");
      pusher.unsubscribe("send.notification.from.representative.to.lawyer");
      pusher.unsubscribe("send.notification.from.representative.to.user");
      pusher.unsubscribe("send.notification.from.lawyer.to.representative");
      pusher.unsubscribe("send.notification.from.lawyer.to.user");
    };
  }, [location.search, lawyers]);
  const [footerHeight, setFooterHeight] = useState(
    document.querySelector("footer")?.offsetHeight
  );
  const [headerHeight, setHeaderHeight] = useState(
    document.querySelector("header")?.offsetHeight
  );
  // const [chatArea, setChatArea] = useState();
  useEffect(() => {
    const footer = document.querySelector("footer") as HTMLElement;
    const header = document.querySelector("header");
    setHeaderHeight(header?.offsetHeight);
    setFooterHeight(footer.offsetHeight);
    window.onresize = () => {
      setFooterHeight(footer.offsetHeight);
    };
  }, []);
  // Handle sending a new message
  const handleSendMessage = async () => {
    const body = {
      [localStorage.getItem("role") !== "user" ? "user_id" : "lawyer_id"]:
        localStorage.getItem("role") !== "user" ? 3 : 3,
      content: newMessage,
    };
    if (newMessage.trim() && selectedLawyer) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/conversations/${selectedLawyer?.id}/send_message`,
          body,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const newMessageObj = {
          id: res.data.id,
          text: newMessage,
          sender: localStorage.getItem("role"),
        };

        setMessages((prevMessages) => [...prevMessages, newMessageObj]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  const messagesEndRef = useRef(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Use effect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <ChatContainer dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Chat List */}
      <ChatList>
        <Typography variant="h6" p={2} textAlign="center" fontWeight={600}>
          Conversations
        </Typography>
        <Divider />
        {loadingCon ? (
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <List>
            {lawyers.map((lawyer) => (
              <ListItem
                component="div"
                key={lawyer.id}
                onClick={() => handleSelectLawyer(lawyer)}
                // selected={selectedLawyer?.id === lawyer.id} seen
                sx={{
                  cursor: "pointer",
                  bgcolor: `${selectedLawyer?.id === lawyer.id ? "#f9f9f9" : ""}`,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`${import.meta.env.VITE_API_URL_IMAGE}${lawyer.avatar}`}
                    alt={lawyer.name}
                  >
                    {!lawyer?.avatar && lawyer.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={lawyer.name}
                  secondary={
                    selectedLawyer?.id === lawyer.id
                      ? "Currently viewing"
                      : "Click to view messages"
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </ChatList>

      {/* Chat Area */}
      <ChatArea
        sx={{
          height: `calc(${document.documentElement.scrollHeight}px - ${headerHeight}px - ${footerHeight}px)`,
        }}
        className="chatArea"
      >
        {selectedLawyer ? (
          <>
            <MessagesArea>
              {loading ? (
                <Box>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent={
                        index % 2 === 0 ? "flex-end" : "flex-start"
                      }
                      mb={2}
                    >
                      <Box
                        p={2}
                        borderRadius={4}
                        width={100}
                        height={40}
                        bgcolor={index % 2 === 0 ? "#5c7c93" : "#e0e0e0"}
                        color={index % 2 === 0 ? "#fff" : "#000"}
                        maxWidth="60%"
                      >
                        {/* <Skeleton variant="text" width="100%" height={20} /> */}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    display="flex"
                    justifyContent={
                      message.sender === localStorage.getItem("role")
                        ? "flex-end"
                        : "flex-start"
                    }
                    mb={2}
                  >
                    <Box
                      p={2}
                      borderRadius={4}
                      bgcolor={
                        message.sender === localStorage.getItem("role")
                          ? "#5c7c93"
                          : "#e0e0e0"
                      }
                      color={
                        message.sender === localStorage.getItem("role")
                          ? "#fff"
                          : "#000"
                      }
                      maxWidth="60%"
                    >
                      {message.text}
                    </Box>
                  </Box>
                ))
              )}
            </MessagesArea>

            <MessageInputArea>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </MessageInputArea>
          </>
        ) : (
          <Typography variant="h6" p={3} textAlign="center">
            Please select a lawyer to view messages.
          </Typography>
        )}
      </ChatArea>
    </ChatContainer>
  );
}
