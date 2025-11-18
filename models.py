import json
from datetime import datetime

class Task:
    """
    Core Task class for the app.
    Contains required properties, multiple methods, and serialization helpers.
    """

    def __init__(
        self,
        id,
        title,
        desc="",
        tag="General",
        status="coming-next",
        priority="medium",
        due_date=None,
        comments=0,
        files=0,
        progress=0,
        total_subtasks=0,
        completed_subtasks=0,
        avatars=None
    ):
        # ---- Required properties ----
        self.id = int(id)
        self.title = title
        self.desc = desc
        self.tag = tag
        self.status = status            # coming-next, in-progress, completed
        self.priority = priority        # high, medium, low

        # Store date in ISO format
        self.due_date = due_date or datetime.utcnow().isoformat()

        self.comments = int(comments)
        self.files = int(files)

        self.progress = int(progress)
        self.total_subtasks = int(total_subtasks)
        self.completed_subtasks = int(completed_subtasks)

        # List of assigned user avatar IDs
        self.avatars = avatars or []


    # -------------------------------------------------------
    # Methods required by the course (functions that do work)
    # -------------------------------------------------------

    def mark_complete(self):
        """
        Mark this task as completed and update progress accordingly.
        """
        self.status = "completed"
        self.completed_subtasks = self.total_subtasks
        self.progress = 100


    def update_progress(self, completed_subtasks):
        """
        Update completed subtasks and automatically recalculate progress.
        """
        try:
            completed_subtasks = int(completed_subtasks)
        except (ValueError, TypeError):
            completed_subtasks = 0

        # Clamp to a valid range
        self.completed_subtasks = max(0, min(completed_subtasks, self.total_subtasks))

        if self.total_subtasks > 0:
            self.progress = int((self.completed_subtasks / self.total_subtasks) * 100)
        else:
            self.progress = 0

        # If progress hits 100%, automatically mark completed
        if self.progress >= 100:
            self.mark_complete()


    # -------------------------------------------------------
    # Serialization helpers (important for saving to JSON)
    # -------------------------------------------------------

    def to_dict(self):
        """
        Convert the Task object into a JSON-serializable dictionary.
        """
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.desc,
            "tag": self.tag,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date,
            "comments": self.comments,
            "files": self.files,
            "progress": self.progress,
            "total_subtasks": self.total_subtasks,
            "completed_subtasks": self.completed_subtasks,
            "avatars": self.avatars
        }


    @classmethod
    def from_dict(cls, data):
        """
        Recreate a Task object from a dictionary loaded from JSON.
        """
        return cls(
            id=data.get("id"),
            title=data.get("title", ""),
            desc=data.get("desc", ""),
            tag=data.get("tag", "General"),
            status=data.get("status", "coming-next"),
            priority=data.get("priority", "medium"),
            due_date=data.get("due_date"),
            comments=data.get("comments", 0),
            files=data.get("files", 0),
            progress=data.get("progress", 0),
            total_subtasks=data.get("total_subtasks", 0),
            completed_subtasks=data.get("completed_subtasks", 0),
            avatars=data.get("avatars", []),
        )
