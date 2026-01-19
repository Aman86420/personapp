import { Calendar, Clock, MapPin, File as FileIcon } from 'lucide-react';

interface DynamicField {
  label: string;
  value: string;
  start_time: string;
  end_time: string;
}

interface DayCardProps {
  data: {
    label_one: string;
    location: string;
    start_time: string;
    end_time: string;
    created_at: string;
    file_url?: string;
    file_name?: string;
    dynamic_fields: DynamicField[];
  };
}

export function DayCard({ data }: DayCardProps) {
  // Format the date from created_at or use a default
  const dateStr = new Date(data.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-100">
      <div className="p-6 flex flex-col h-full">
        {/* Card Header - Date */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">
            {dateStr}
          </h3>
        </div>

        {/* Card Body - Primary Details */}
        <div className="space-y-4 flex-1">
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/70">Primary Field</span>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Clock className="w-3 h-3" />
                {data.start_time} - {data.end_time}
              </div>
            </div>
            <p className="font-semibold text-gray-900 leading-tight">{data.label_one}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              {data.location}
            </div>
          </div>

          {/* Dynamic Fields */}
          {data.dynamic_fields && data.dynamic_fields.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">Additional Entries</span>
              {data.dynamic_fields.map((field, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-gray-500">{field.label}</span>
                    <span className="text-[10px] text-gray-400">{field.start_time} - {field.end_time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{field.value}</p>
                </div>
              ))}
            </div>
          )}
          {/* File Link */}
          {data.file_url && (
            <div className="pt-2">
              <a
                href={data.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium group"
              >
                <FileIcon className="w-3 h-3 transition-transform group-hover:scale-110" />
                View Attachment: <span className="truncate max-w-[120px]">{data.file_name || 'File'}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}