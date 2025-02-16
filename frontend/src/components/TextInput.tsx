import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({ value, onChange, placeholder }: TextInputProps) => {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        placeholder={placeholder || "Type your message here..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
};

export default TextInput;
