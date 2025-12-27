import { IService } from "@/src/types";
import { Button } from "@heroui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pencil, Trash2 } from "lucide-react";

interface ServicesTableProps {
  services: {
    data: IService[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  onEditOpen: () => void;
  onDeleteOpen: () => void;
  setSelectedService: (service: IService) => void;
}

export default function ServicesTable({
  services,
  onEditOpen,
  onDeleteOpen,
  setSelectedService,
}: ServicesTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table aria-label="Services table" className="min-w-full">
        <TableHeader>
          <TableColumn>SERVICE NAME</TableColumn>
          <TableColumn>SERVICE TITLE</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {services.data.map((service: IService) => (
            <TableRow key={service._id}>
              <TableCell>{service.serviceName}</TableCell>
              <TableCell>{service.serviceTitle}</TableCell>
              <TableCell>${service.servicePrice}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    isIconOnly
                    onPress={() => {
                      setSelectedService(service);
                      onEditOpen();
                    }}
                    aria-label="Edit service"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onPress={() => {
                      setSelectedService(service);
                      onDeleteOpen();
                    }}
                    aria-label="Delete service"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
