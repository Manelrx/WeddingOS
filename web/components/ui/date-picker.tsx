'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder = "Selecione uma data" }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Click outside to close
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-start text-left font-normal rounded-md border h-14 bg-white px-4 py-2 text-sm transition-all shadow-sm",
                    "border-gray-200 hover:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400",
                    !date && "text-gray-500",
                    isOpen && "border-gold-400 ring-2 ring-gold-400/20"
                )}
            >
                <CalendarIcon className={cn("mr-3 h-5 w-5", date ? "text-gold-500" : "text-gray-400")} />
                <span className="text-base truncate">
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 left-0 top-[calc(100%+8px)] bg-white rounded-2xl p-4 shadow-soft-gold border border-gold-400/20 animate-slide-up">
                    <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            setDate(d);
                            setIsOpen(false);
                        }}
                        locale={ptBR}
                        showOutsideDays
                        className="p-0 font-sans"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-base font-serif font-semibold text-gray-900",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                                "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity border-none rounded-full flex items-center justify-center hover:bg-ivory-100 text-gray-700"
                            ),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-taupe-light rounded-md w-10 font-normal text-[0.85rem] uppercase",
                            row: "flex w-full mt-2",
                            cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                            day: cn(
                                "h-10 w-10 p-0 font-normal rounded-full transition-colors hover:bg-gold-50 hover:text-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400"
                            ),
                            day_selected: "bg-gold-400 text-white hover:bg-gold-500 hover:text-white focus:bg-gold-400 focus:text-white font-semibold",
                            day_today: "text-gold-600 font-bold bg-ivory-50",
                            day_outside: "text-gray-300 opacity-50",
                            day_disabled: "text-gray-300 opacity-50",
                            day_hidden: "invisible",
                        }}
                        components={{
                            Chevron: (props) => {
                                if (props.orientation === "left") {
                                    return <ChevronLeft className="h-5 w-5" />;
                                }
                                return <ChevronRight className="h-5 w-5" />;
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}
