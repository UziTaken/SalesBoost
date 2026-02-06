import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerPersona } from '@/services/customer.service';
import { Play, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerPersona | null;
  onEdit: (customer: CustomerPersona) => void;
  onDelete: (customer: CustomerPersona) => void;
}

export default function CustomerViewDialog({ open, onOpenChange, customer, onEdit, onDelete }: CustomerViewDialogProps) {
  const navigate = useNavigate();

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>客户详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br p-1">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${customer.avatarColor} flex items-center justify-center`}>
                <span className="text-3xl font-bold text-gray-700 opacity-50">
                  {customer.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{customer.name}</h3>
              <p className="text-gray-500">{customer.age}岁 · {customer.job}</p>
            </div>
          </div>

          {/* Traits */}
          {customer.traits && customer.traits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">客户特征</h4>
              <div className="flex flex-wrap gap-2">
                {customer.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">描述</h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{customer.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{customer.rehearsalCount}</div>
              <div className="text-xs text-gray-500 mt-1">预演次数</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-blue-600">{customer.lastRehearsalTime}</div>
              <div className="text-xs text-gray-500 mt-1">最后预演</div>
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <span>创建者: {customer.creator}</span>
            <span>ID: {customer.id}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                onOpenChange(false);
                navigate('/student/training');
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              开始预演
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit(customer);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                onOpenChange(false);
                onDelete(customer);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
