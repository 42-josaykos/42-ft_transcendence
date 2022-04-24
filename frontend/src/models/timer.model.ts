export interface timerInterval {
  channelId: number;
  idInterval:  NodeJS.Timeout;
  timeLeft: string;
}

export interface Timer {
  channelId: number;
  timeLeft: string;
}