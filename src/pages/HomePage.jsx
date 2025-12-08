import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function paramsToState(p) {
  return {
    q: p.get("q") ?? "",
    cat: p.get("cat") || undefined,
    st: p.get("st") || undefined,
    sort: p.get("sort") || "created-desc",
  };
}

function stateToParams(s) {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.cat) p.set("cat", s.cat);
  if (s.st) p.set("st", s.st);
  if (s.sort && s.sort !== "created-desc") p.set("sort", s.sort);
  return p;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => paramsToState(searchParams));

  useEffect(() => {
    setFilters(paramsToState(searchParams));
  }, [searchParams]);

  const handleChange = (next) => {
    setFilters(next);
    setSearchParams(stateToParams(next));
  };

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
