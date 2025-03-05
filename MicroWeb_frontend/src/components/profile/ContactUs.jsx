import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import "../../style/contactus.css";

import contactUs from "../../assets/images/undraw_contact-us.svg";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  description: z
    .string()
    .min(30, "Min 30 characters allowed")
    .max(60, "Max 60 characters allowed"),
});

const ContactUs = () => {
  const emailId = useSelector((state) => state.user.user.email);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: emailId },
  });

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message);
    }

    if (errors.description) {
      toast.error(errors.description.message);
    }
  }, [errors]);

  const onSubmit = (data) => {
    toast.success("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <section className="contactus_container">
      <div className="contactus_image">
        <img src={contactUs} alt="Contact Us" />
      </div>

      <div className="contactus_form">
        <form onSubmit={handleSubmit(onSubmit)} className="contactus_form">
          <div className="contactus_title">
            <h1>Contact Us</h1>
            <p>Reach out to us for any help or inquiries.</p>
          </div>

          {/* Email Field */}
          <div className="input_email field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email")}
              disabled={true}
              placeholder="Enter your email"
            />
          </div>

          {/* Description Field */}
          <div className="input_description field">
            <label htmlFor="description">Description</label>
            <textarea
              {...register("description")}
              placeholder="Enter your message (max 60 characters)"
            />
          </div>

          {/* Submit Button */}
          <div className="submit_btn">
            <button type="submit" disabled={isSubmitting} className="btn">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
