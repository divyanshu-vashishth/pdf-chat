from sqlmodel import Field, SQLModel, create_engine, Session
import datetime

class Document(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    filename: str
    upload_date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

engine = create_engine("sqlite:///db.sqlite3")
SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)
