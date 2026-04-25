import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ImageUpload from '../Common/ImageUpload';

const normalizeType = (type) => (type === 'basics' ? 'basic_needs' : type);
const splitLines = (value) => (value || '').split('\n').map((item) => item.trim()).filter(Boolean);
const splitCsv = (value) => (value || '').split(',').map((item) => item.trim()).filter(Boolean);
const toNumber = (value) => (value ? Number(value) : undefined);
const compactObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(compactObject).filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((result, [key, item]) => {
      const compacted = compactObject(item);
      if (compacted !== undefined) {
        result[key] = compacted;
      }
      return result;
    }, {});
  }

  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

const getSubmissionErrorMessage = (error) => {
  const details = error.response?.data?.details;
  if (Array.isArray(details) && details.length > 0) {
    return details.map((item) => item.message || item.field).join(', ');
  }

  return error.response?.data?.message
    || error.response?.data?.error
    || error.message
    || 'Submission failed';
};

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error ? <p className="client-form-error mt-1">{error.message}</p> : null}
    </div>
  );
}

export default function DonationForm({ type = 'cash', onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const donationType = normalizeType(type);

  const textInput = (name, rules, props = {}) => ({
    ...register(name, rules),
    disabled: isLoading,
    className: 'mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5',
    ...props,
  });

  const buildDetails = (data) => {
    const details = {
      currency: 'INR',
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      proofType: data.proofType,
      transactionReference: data.transactionReference,
      consentToVerify: Boolean(data.consentToVerify),
      pickupWindowStart: data.pickupWindowStart || undefined,
      pickupWindowEnd: data.pickupWindowEnd || undefined,
      pickupInstructions: data.pickupInstructions,
      details: data.details,
      description: data.description,
    };

    if (donationType === 'food') {
      Object.assign(details, {
        foodType: data.foodType,
        quantity: toNumber(data.quantity),
        unit: data.unit,
        servings: toNumber(data.servings),
        isSurplusFood: true,
        foodSource: data.foodSource,
        preparedAt: data.preparedAt || undefined,
        expiresAt: data.expiresAt || undefined,
        storageCondition: data.storageCondition,
        packaging: data.packaging,
      });
    }

    if (donationType === 'shelter') {
      Object.assign(details, {
        shelterType: data.shelterType,
        duration: data.duration,
        emergencyLocation: data.emergencyLocation,
        affectedPeopleCount: toNumber(data.affectedPeopleCount),
      });
    }

    if (donationType === 'medical') {
      Object.assign(details, {
        medicineType: data.medicineType,
        hasDocPermission: Boolean(data.hasDocPermission),
        doctorPermission: Boolean(data.hasDocPermission),
        medicalDetails: data.medicalDetails,
      });
    }

    if (donationType === 'basic_needs') {
      Object.assign(details, {
        items: splitLines(data.items),
        condition: data.condition,
        clothingType: data.clothingType,
        ageGroup: data.ageGroup,
        gender: data.gender,
        sizes: splitCsv(data.sizes),
        itemCount: toNumber(data.itemCount),
        washed: Boolean(data.washed),
      });
    }

    if (donationType === 'emergency') {
      Object.assign(details, {
        emergencyType: data.emergencyType,
        emergencyLocation: data.emergencyLocation,
        affectedPeopleCount: toNumber(data.affectedPeopleCount),
        requiredBy: data.requiredBy || undefined,
        priority: data.priority,
        reliefItems: splitLines(data.reliefItems),
      });
    }

    if (uploadedImage) {
      details.imageUrl = uploadedImage.url;
      details.imagePublicId = uploadedImage.publicId;
      details.proofDocuments = [{
        type: data.proofType || 'photo',
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
        notes: data.notes,
      }];
    }

    return compactObject(details);
  };

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      await onSubmit({
        type: donationType,
        amount: Number(data.amount) || 0,
        details: buildDetails(data),
      });
      toast.success('Donation submitted successfully!');
    } catch (error) {
      toast.error(getSubmissionErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const commonFields = (
    <>
      <div className="donation-form-grid">
        <Field id="name" label="Full Name *" error={errors.name}>
          <input id="name" type="text" placeholder="Donor or organization name" {...textInput('name', { required: 'Name is required' })} />
        </Field>
        <Field id="phone" label="Phone Number *" error={errors.phone}>
          <input id="phone" type="tel" placeholder="10-digit phone number" {...textInput('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' } })} />
        </Field>
      </div>
      <Field id="address" label="Pickup / Contact Address *" error={errors.address}>
        <textarea id="address" rows="3" placeholder="Full address with landmark" {...textInput('address', { required: 'Address is required' })} />
      </Field>
      <div className="donation-form-grid">
        <Field id="pickupWindowStart" label="Pickup Window Start">
          <input id="pickupWindowStart" type="datetime-local" {...textInput('pickupWindowStart')} />
        </Field>
        <Field id="pickupWindowEnd" label="Pickup Window End">
          <input id="pickupWindowEnd" type="datetime-local" {...textInput('pickupWindowEnd')} />
        </Field>
      </div>
      <Field id="pickupInstructions" label="Volunteer Pickup Instructions">
        <textarea id="pickupInstructions" rows="2" placeholder="Gate, floor, contact timing, handling notes" {...textInput('pickupInstructions')} />
      </Field>
    </>
  );

  const amountField = (label = 'Estimated Value (INR) *') => (
    <Field id="amount" label={label} error={errors.amount}>
      <input id="amount" type="number" min="1" step="0.01" placeholder="Enter amount or estimated value" {...textInput('amount', { required: 'Amount is required', validate: (value) => Number(value) > 0 || 'Amount must be greater than 0' })} />
    </Field>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 donation-operation-form">
      {commonFields}
      {amountField(donationType === 'cash' ? 'Donation Amount (INR) *' : 'Estimated Value (INR) *')}

      {donationType === 'food' && (
        <div className="donation-form-grid">
          <Field id="foodType" label="Food Type *" error={errors.foodType}>
            <input id="foodType" placeholder="Cooked meals, dry ration, packaged food" {...textInput('foodType', { required: 'Food type is required' })} />
          </Field>
          <Field id="quantity" label="Quantity *" error={errors.quantity}>
            <input id="quantity" type="number" min="1" placeholder="Total quantity" {...textInput('quantity', { required: 'Quantity is required' })} />
          </Field>
          <Field id="unit" label="Unit"><input id="unit" placeholder="servings, kg, packets" {...textInput('unit')} /></Field>
          <Field id="servings" label="Estimated Servings"><input id="servings" type="number" min="1" {...textInput('servings')} /></Field>
          <Field id="foodSource" label="Food Source"><input id="foodSource" placeholder="Home, restaurant, event, store" {...textInput('foodSource')} /></Field>
          <Field id="packaging" label="Packaging Status"><input id="packaging" placeholder="Packed, sealed, needs containers" {...textInput('packaging')} /></Field>
          <Field id="preparedAt" label="Prepared At"><input id="preparedAt" type="datetime-local" {...textInput('preparedAt')} /></Field>
          <Field id="expiresAt" label="Safe Until"><input id="expiresAt" type="datetime-local" {...textInput('expiresAt')} /></Field>
          <Field id="storageCondition" label="Storage Condition"><input id="storageCondition" placeholder="Hot, chilled, room temperature" {...textInput('storageCondition')} /></Field>
        </div>
      )}

      {donationType === 'shelter' && (
        <div className="donation-form-grid">
          <Field id="shelterType" label="Shelter Type *" error={errors.shelterType}>
            <select id="shelterType" {...textInput('shelterType', { required: 'Shelter type is required' })}>
              <option value="">Select shelter type</option>
              <option value="room">Single Room</option>
              <option value="house">Full House</option>
              <option value="temporary">Temporary Stay</option>
              <option value="rent_support">Rent Support</option>
            </select>
          </Field>
          <Field id="duration" label="Available Duration *" error={errors.duration}><input id="duration" placeholder="3 nights, 1 month, immediate only" {...textInput('duration', { required: 'Duration is required' })} /></Field>
          <Field id="emergencyLocation" label="Shelter Area"><input id="emergencyLocation" placeholder="Locality, city" {...textInput('emergencyLocation')} /></Field>
          <Field id="affectedPeopleCount" label="Capacity"><input id="affectedPeopleCount" type="number" min="1" placeholder="People supported" {...textInput('affectedPeopleCount')} /></Field>
        </div>
      )}

      {donationType === 'medical' && (
        <>
          <div className="donation-form-grid">
            <Field id="medicineType" label="Medicine / Support Type *" error={errors.medicineType}><input id="medicineType" placeholder="Medicines, device, treatment support" {...textInput('medicineType', { required: 'Medicine/support type is required' })} /></Field>
            <Field id="transactionReference" label="Bill / Reference Number"><input id="transactionReference" placeholder="Optional bill or purchase reference" {...textInput('transactionReference')} /></Field>
          </div>
          <label className="donation-checkbox"><input type="checkbox" {...register('hasDocPermission')} disabled={isLoading} /> Doctor permission or prescription available</label>
          <Field id="medicalDetails" label="Medical Details *" error={errors.medicalDetails}><textarea id="medicalDetails" rows="3" placeholder="Condition, expiry, prescription requirement, handling notes" {...textInput('medicalDetails', { required: 'Medical details are required' })} /></Field>
        </>
      )}

      {donationType === 'basic_needs' && (
        <>
          <Field id="items" label="Items to Donate * (one per line)" error={errors.items}><textarea id="items" rows="4" placeholder={'Shirts - 10\nBlankets - 5\nHygiene kits - 12'} {...textInput('items', { required: 'Items list is required' })} /></Field>
          <div className="donation-form-grid">
            <Field id="condition" label="Condition *" error={errors.condition}>
              <select id="condition" {...textInput('condition', { required: 'Condition is required' })}>
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </Field>
            <Field id="itemCount" label="Total Item Count"><input id="itemCount" type="number" min="1" {...textInput('itemCount')} /></Field>
            <Field id="clothingType" label="Clothing / Basic Category"><input id="clothingType" placeholder="Winterwear, hygiene, school supplies" {...textInput('clothingType')} /></Field>
            <Field id="sizes" label="Sizes (comma separated)"><input id="sizes" placeholder="S, M, L, kids 8-10" {...textInput('sizes')} /></Field>
            <Field id="ageGroup" label="Age Group"><input id="ageGroup" placeholder="Infant, children, adults, elderly" {...textInput('ageGroup')} /></Field>
            <Field id="gender" label="Gender Fit"><input id="gender" placeholder="Men, women, unisex, children" {...textInput('gender')} /></Field>
          </div>
          <label className="donation-checkbox"><input type="checkbox" {...register('washed')} disabled={isLoading} /> Clothes are washed, sorted, and packed</label>
        </>
      )}

      {donationType === 'emergency' && (
        <>
          <div className="donation-form-grid">
            <Field id="emergencyType" label="Emergency Type *" error={errors.emergencyType}><input id="emergencyType" placeholder="Flood, fire, heatwave, accident relief" {...textInput('emergencyType', { required: 'Emergency type is required' })} /></Field>
            <Field id="priority" label="Priority *" error={errors.priority}>
              <select id="priority" {...textInput('priority', { required: 'Priority is required' })}>
                <option value="">Select priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>
            <Field id="emergencyLocation" label="Affected Location *" error={errors.emergencyLocation}><input id="emergencyLocation" placeholder="Area, city, landmark" {...textInput('emergencyLocation', { required: 'Affected location is required' })} /></Field>
            <Field id="affectedPeopleCount" label="People Supported"><input id="affectedPeopleCount" type="number" min="1" {...textInput('affectedPeopleCount')} /></Field>
            <Field id="requiredBy" label="Required By"><input id="requiredBy" type="datetime-local" {...textInput('requiredBy')} /></Field>
          </div>
          <Field id="reliefItems" label="Relief Items * (one per line)" error={errors.reliefItems}><textarea id="reliefItems" rows="4" placeholder={'Water bottles - 100\nBlankets - 20\nFirst-aid kits - 10'} {...textInput('reliefItems', { required: 'Relief items are required' })} /></Field>
        </>
      )}

      {donationType === 'cash' && (
        <Field id="description" label="Cash Purpose / Case Notes"><textarea id="description" rows="3" placeholder="Which verified need or relief purpose should this support?" {...textInput('description')} /></Field>
      )}

      <div className="donation-form-grid">
        <Field id="proofType" label="Proof Type"><input id="proofType" placeholder="photo, bill, transaction, inventory list" {...textInput('proofType')} /></Field>
        <Field id="transactionReference" label="Reference / Batch ID"><input id="transactionReference" placeholder="UPI ref, bill number, batch note" {...textInput('transactionReference')} /></Field>
      </div>
      <Field id="notes" label="Verification Notes"><textarea id="notes" rows="3" placeholder="Anything the admin or volunteer should verify before routing this donation" {...textInput('notes')} /></Field>
      <label className="donation-checkbox"><input type="checkbox" {...register('consentToVerify')} disabled={isLoading} /> I consent to volunteer/admin verification of these details</label>

      <ImageUpload onImageUpload={setUploadedImage} disabled={isLoading} folder="donations" />

      <button type="submit" disabled={isLoading} className="client-button donation-submit-button">
        {isLoading ? 'Processing...' : 'Submit Donation'}
      </button>
    </form>
  );
}
