type AttentionSummaryProps = {
  overdue: number;
  dueToday: number;
};

export function AttentionSummary({ overdue, dueToday }: AttentionSummaryProps) {
  let message = "You're all caught up.";
  let tone = "text-emerald-700 dark:text-emerald-400";

  if (overdue > 0) {
    message =
      overdue === 1
        ? "1 overdue follow-up needs attention."
        : `${overdue} overdue follow-ups need attention.`;
    tone = "text-destructive";
  } else if (dueToday > 0) {
    message =
      dueToday === 1
        ? "1 follow-up is due today."
        : `${dueToday} follow-ups are due today.`;
    tone = "text-amber-700 dark:text-amber-400";
  }

  return (
    <p className={`text-base font-medium ${tone}`} role="status">
      {message}
      {overdue > 0 && dueToday > 0
        ? ` ${dueToday === 1 ? "1 more is" : `${dueToday} more are`} due today.`
        : null}
    </p>
  );
}
