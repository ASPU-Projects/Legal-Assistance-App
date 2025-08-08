import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Avatar,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import NoteIcon from "@mui/icons-material/Note";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function IssuePage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [issue, setIssue] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const fetchIssue = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setIssue(res?.data?.issue || {});
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    setNotesLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/notes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotes(res?.data?.notes || []);
      setNotesLoading(false);
    } catch (error) {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/notes`,
        { note: newNote },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotes((prevNotes) => [...prevNotes, res.data]);
      setNewNote("");
      Swal.fire(t("note_added_successfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failed_to_add_note"), "", "error");
    }
  };

  const handleEditNote = async (noteId) => {
    if (!editingNoteText.trim()) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/notes/${noteId}`,
        { note: editingNoteText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, note: editingNoteText } : note
        )
      );
      setEditingNoteId(null);
      setEditingNoteText("");
      Swal.fire(t("note_updated_successfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failed_to_update_note"), "", "error");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/notes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      Swal.fire(t("note_deleted_successfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failed_to_delete_note"), "", "error");
    }
  };
  // State for attachments
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentsDialogOpen, setAttachmentsDialogOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);

  // Fetch attachments
  const fetchAttachments = async () => {
    setAttachmentsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setAttachments(res?.data?.attachments || []);
      setAttachmentsLoading(false);
    } catch (error) {
      setAttachmentsLoading(false);
    }
  };

  // Add attachment
  const handleAddAttachment = async () => {
    if (!newAttachment) return;

    const formData = new FormData();
    formData.append("type", "pdf");
    formData.append("attachments[]", newAttachment);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/attachments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAttachments((prev) => [...prev, res.data]);
      setNewAttachment(null);
      Swal.fire(t("attachment_added_successfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failed_to_add_attachment"), "", "error");
    }
  };

  // Delete attachment
  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues/${id}/attachments/${attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
      Swal.fire(t("attachment_deleted_successfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failed_to_delete_attachment"), "", "error");
    }
  };
  useEffect(() => {
    fetchIssue();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f4f8"
      p={4}
      sx={{
        backgroundImage: "url(/backBook.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          boxShadow: 5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#5c7c93",
            color: "#fff",
            p: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${import.meta.env.VITE_API_URL_IMAGE}${issue?.court_id}`}
            sx={{
              bgcolor: "#fff",
              color: "#5c7c93",
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            {loading ? (
              <Skeleton variant="circular" width={56} height={56} />
            ) : (
              issue?.court_name?.[0]
            )}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              `${t("court_name")}: ${issue?.court_name}`
            )}
          </Typography>
        </Box>
        <CardContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
            <Box>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                ))
              ) : (
                <>
                  <Typography variant="body1" mb={1}>
                    <strong>Base Number:</strong> {issue?.base_number}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Record Number:</strong> {issue?.record_number}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Agency Sequential:</strong>{" "}
                    {issue?.agency_sequential}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Agency Record:</strong> {issue?.agency_record}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Status:</strong> {issue?.status}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Start Date:</strong> {issue?.start_date}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Estimated Cost:</strong> {issue?.estimated_cost}
                  </Typography>
                </>
              )}
            </Box>
            <Box>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                ))
              ) : (
                <>
                  <Typography variant="body1" mb={1}>
                    <strong>Is Active:</strong> {issue?.is_active}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>Court Room Name:</strong> {issue?.court_room_name}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<NoteIcon />}
            onClick={() => {
              fetchNotes();
              setDialogOpen(true);
            }}
            disabled={loading}
          >
            {t("view_notes")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<NoteIcon />}
            onClick={() => {
              fetchAttachments();
              setAttachmentsDialogOpen(true);
            }}
            disabled={loading}
          >
            {t("view_attachments")}
          </Button>
        </CardActions>
        ;
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{t("notes")}</DialogTitle>
        <DialogContent>
          {notesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={50} sx={{ mb: 1 }} />
            ))
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <Box
                key={note.id}
                mb={2}
                p={2}
                borderRadius={2}
                bgcolor={note.sender_type === "lawyer" ? "#e3f2fd" : "#f9fbe7"}
              >
                {editingNoteId === note.id ? (
                  <>
                    <TextField
                      fullWidth
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <Button
                        color="primary"
                        onClick={() => handleEditNote(note.id)}
                        size="small"
                      >
                        {t("save")}
                      </Button>
                      <Button
                        onClick={() => setEditingNoteId(null)}
                        size="small"
                      >
                        {t("cancel")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      {note.sender_type === "lawyer"
                        ? t("lawyer_note")
                        : t("user_note")}
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {note.note}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditingNoteText(note.note);
                        }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteNote(note.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            ))
          ) : (
            <Typography>{t("no_notes_available")}</Typography>
          )}

          <Box mt={3}>
            <TextField
              fullWidth
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              label={t("add_new_note")}
              variant="outlined"
              size="small"
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddNote}
                color="primary"
              >
                {t("add_note")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
      {/* attachment */}
      <Dialog
        open={attachmentsDialogOpen}
        onClose={() => setAttachmentsDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>{t("attachments")}</DialogTitle>
        <DialogContent>
          {attachmentsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={50} sx={{ mb: 1 }} />
            ))
          ) : attachments.length > 0 ? (
            attachments.map((att) => (
              <Box
                key={att.id}
                mb={2}
                p={2}
                borderRadius={2}
                bgcolor={
                  att.sender_type === "lawyer" ? "#e8f5e9" : "#e3f2fd" // لون مختلف للمحامي
                }
              >
                <Typography variant="body2" fontWeight={600}>
                  {att.sender_type === "lawyer"
                    ? t("lawyer_attachment")
                    : t("user_attachment")}
                </Typography>
                <Typography variant="body1" mb={1}>
                  {att.file_name.split("/").pop()} (
                  {att.file_type.toUpperCase()})
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Button
                    href={`${import.meta.env.VITE_API_URL_IMAGE}${att.file_name}`}
                    target="_blank"
                    variant="contained"
                    color="primary"
                    // download={true}
                  >
                    {t("open")}
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteAttachment(att.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  mt={1}
                >
                  {t("uploaded_at")}:{" "}
                  {new Date(att.created_at).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>{t("no_attachments_available")}</Typography>
          )}
          <Box mt={3}>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: "application/pdf,image/*" }}
              // onChange={(e) => setNewAttachment(e.target.files[0])}
              onChange={(e) =>
                setNewAttachment(
                  (e.target as HTMLInputElement).files?.[0] || null
                )
              }
              label={t("add_new_attachment")}
              variant="outlined"
              size="small"
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddAttachment}
                color="primary"
              >
                {t("add_attachment")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttachmentsDialogOpen(false)}>
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
