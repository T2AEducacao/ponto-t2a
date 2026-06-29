export function formatWorkedTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
}

export function getClockEventLabel(type: string) {
  const labels: Record<string, string> = {
    entry: "Entrada",
    lunch_start: "Saida almoco",
    lunch_end: "Volta almoco",
    exit: "Saida final",
  };

  return labels[type] ?? type;
}

export function getLocationStatusLabel(status: string) {
  const labels: Record<string, string> = {
    inside: "Dentro da area",
    outside: "Fora da area",
    unavailable: "Sem localizacao",
  };

  return labels[status] ?? status;
}
