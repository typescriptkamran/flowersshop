"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Pencil, Trash2 } from "lucide-react";
import AddressForm from "./AddressForm";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressesTabProps {
  userId: string;
}

export default function AddressesTab({ userId }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`/api/user/addresses`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch addresses");
        }

        setAddresses(data.addresses);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete address");
      }

      setAddresses(addresses.filter((address) => address.id !== addressId));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: "PUT",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to set default address");
      }

      setAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        })),
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleAddressSubmit = async (addressData: Omit<Address, "id">) => {
    try {
      if (editingAddress) {
        // Update existing address
        const response = await fetch(
          `/api/user/addresses/${editingAddress.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(addressData),
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to update address");
        }

        const data = await response.json();
        setAddresses(
          addresses.map((address) =>
            address.id === editingAddress.id ? data.address : address,
          ),
        );
      } else {
        // Add new address
        const response = await fetch(`/api/user/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to add address");
        }

        const data = await response.json();
        setAddresses([...addresses, data.address]);
      }

      setShowAddForm(false);
      setEditingAddress(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <Button variant="ghost" onClick={() => setShowAddForm(false)}>
            Cancel
          </Button>
        </div>
        <AddressForm
          initialData={editingAddress || undefined}
          onSubmit={handleAddressSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddAddress} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No addresses yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a delivery address to make checkout faster.
          </p>
          <div className="mt-6">
            <Button onClick={handleAddAddress}>Add Address</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {address.street.split(",")[0]}
                    </span>
                  </div>
                  {address.isDefault && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-500"
                    >
                      Default
                    </Badge>
                  )}
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
