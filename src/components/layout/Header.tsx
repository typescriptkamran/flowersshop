import React from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  cartItemCount?: number;
  isLoggedIn?: boolean;
  username?: string;
}

const Header = ({
  cartItemCount = 3,
  isLoggedIn = false,
  username = "Guest",
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-6 py-6">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">BlossomCart</span>
              </Link>
              <nav className="grid gap-4">
                <Link to="/products" className="hover:text-primary">
                  All Flowers
                </Link>
                <Link to="/occasions" className="hover:text-primary">
                  Occasions
                </Link>
                <Link to="/bestsellers" className="hover:text-primary">
                  Best Sellers
                </Link>
                <Link to="/new" className="hover:text-primary">
                  New Arrivals
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="hidden text-xl font-bold md:inline-block">
            BlossomCart
          </span>
          <span className="text-xl font-bold md:hidden">BC</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/products"
            className="text-sm font-medium hover:text-primary"
          >
            All Flowers
          </Link>
          <Link
            to="/occasions"
            className="text-sm font-medium hover:text-primary"
          >
            Occasions
          </Link>
          <Link
            to="/bestsellers"
            className="text-sm font-medium hover:text-primary"
          >
            Best Sellers
          </Link>
          <Link to="/new" className="text-sm font-medium hover:text-primary">
            New Arrivals
          </Link>
        </nav>

        {/* Search, User, Wishlist, Cart */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search flowers..."
              className="pl-8 w-[200px] lg:w-[300px] rounded-full bg-gray-50"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
                <span className="sr-only">User account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem className="font-medium">
                    Hello, {username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/account" className="w-full">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/logout" className="w-full">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link to="/login" className="w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/register" className="w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
