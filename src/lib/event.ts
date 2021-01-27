import { NoteConfig } from "./notebook";

export enum EventType {
  ModifiedMarkdown = "ModifiedMarkdown",
  RefreshedNotes = "RefreshedNotes",
  DeletedNote = "DeletedNote",
  ChangedNoteFilePath = "ChangedNoteFilePath",
  PerformedGitOperation = "PerformedGitOperation",
}

export interface ModifiedMarkdownEventData {
  tabId: string;
  notebookPath: string;
  noteFilePath: string;
  markdown: string;
  noteConfig: NoteConfig;
}

export interface RefreshedNotesEventData {
  notebookPath: string;
}

export interface DeletedNoteEventData {
  tabId: string;
  notebookPath: string;
  noteFilePath: string;
}

export interface ChangedNoteFilePathEventData {
  tabId: string;
  notebookPath: string;
  oldNoteFilePath: string;
  newNoteFilePath: string;
}

export interface PerformedGitOperationEventData {
  notebookPath: string;
}

export type EventData =
  | ModifiedMarkdownEventData
  | RefreshedNotesEventData
  | DeletedNoteEventData
  | ChangedNoteFilePathEventData
  | PerformedGitOperationEventData;

export type EventCallback = (data: any) => void;

export class Emitter {
  private subscriptions: { [key: string]: EventCallback[] } = {};
  constructor() {
    this.subscriptions = {};
  }

  public on(eventName: EventType, cb: EventCallback) {
    if (eventName in this.subscriptions) {
      this.subscriptions[eventName].push(cb);
    } else {
      this.subscriptions[eventName] = [cb];
    }
  }

  public off(eventName: EventType, cb: EventCallback) {
    const eventCallbacks = this.subscriptions[eventName] || [];
    const index = eventCallbacks.findIndex((x) => x === cb);
    if (index >= 0) {
      eventCallbacks.splice(index, 1);
    }
  }

  public emit(eventName: EventType, data: EventData) {
    const eventCallbacks = this.subscriptions[eventName].slice() || [];
    eventCallbacks.forEach((callback, offset) => {
      callback(data);
    });
  }
}

export const globalEmitter = new Emitter();

(window as any)["globalEmitter"] = globalEmitter;
