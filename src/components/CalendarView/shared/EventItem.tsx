import { Button, message, Popconfirm } from 'antd';
import { format } from 'date-fns';
import { CalendarEvent } from '../../../types/calendar';
import { useCalendarContext } from '../../../context/CalendarContext';

interface EventItemProps {
  props: {
    event: any;
    setShowForm: any;
    setSelectedEvent: any;
    handleCloseModal: any
  }

}

const EventItem: React.FC<EventItemProps> = ({ props }) => {
  const { dispatch } = useCalendarContext(); 
  const { event, setSelectedEvent, setShowForm, handleCloseModal} = props

  const handleDeleteEvent = () => {
    dispatch({ type: 'REMOVE_EVENT', payload: event.id });
    message.success('Event deleted successfully.');
    setShowForm(false);
    handleCloseModal(false)
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event); 
    setShowForm(true);
  };


  return (
<li
key={event.id}
className="bg-white shadow rounded-lg p-4 border-l-4"
style={{ borderColor: event.color }}
>
<div className="font-bold text-lg">{event.title}</div>
<div className="text-gray-600">{event.description}</div>
<div className="text-sm text-gray-500">
  {format(new Date(event.start), 'hh:mm a')} -{' '}
  {format(new Date(event.end), 'hh:mm a')}
</div>
<div className="text-sm text-gray-500">
  Location: {event.location ? event.location : 'Not specified'}
</div>
<div className="text-sm text-gray-500">
  Guests: {event.guests ? event.guests : 'No guests'}
</div>
<div className="flex justify-end mt-2 space-x-2">
  <Button type="link" onClick={() => handleEditEvent(event)}>
    Edit
  </Button>
  <Popconfirm
    title="Are you sure you want to delete this event?"
    onConfirm={() => handleDeleteEvent()}
    okText="Yes"
    cancelText="No"
  >
    <Button type="link">Delete</Button>
  </Popconfirm>
</div>
</li>
  );
};

export default EventItem;







