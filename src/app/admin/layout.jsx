import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
