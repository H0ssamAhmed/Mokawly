import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black   ">
      <div className="text-center">
        <h1 className="text-4xl bg font-bold mb-4">404</h1>
        <p className="text-xl mb-4">عفواً، الصفحة المطلوبة غير موجودة</p>
        <Button variant="default" className="bg-primary">
          <Link to="/" className="bg-primary underline">
            الصفحة الرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
