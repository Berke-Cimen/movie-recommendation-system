"use client";

import { Badge } from "@/components/ui/badge";

interface GenreTagProps {
  genre: string;
}

export function GenreTag({ genre }: GenreTagProps) {
  return <Badge variant="secondary">{genre}</Badge>;
}
