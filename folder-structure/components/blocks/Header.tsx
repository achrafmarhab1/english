import { ProfileAvatar } from "./Profile";
import { SearchInput } from "./Search";
import { ThemeImage } from "./theme-image";

export function Header() {
  return (
    <header className="flex justify-center fixed w-full top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between w-[80%] h-16  max-sm:w-[92%]">
        <ThemeImage />
        <SearchInput />
        <ProfileAvatar />
      </div>
    </header>
  );
}
